using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using StudentElectionSystem.Api.Configuration;
using StudentElectionSystem.Api.Converters;
using StudentElectionSystem.Api.Middleware;
using StudentElectionSystem.Api.Services;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Application.UseCases.Authentication;
using StudentElectionSystem.Application.UseCases.Candidate.Apply;
using StudentElectionSystem.Application.UseCases.Candidate.Approve;
using StudentElectionSystem.Application.UseCases.Candidate.GetDetails;
using StudentElectionSystem.Application.UseCases.Candidate.GetMyApplications;
using StudentElectionSystem.Application.UseCases.Candidate.GetPending;
using StudentElectionSystem.Application.UseCases.Candidate.Reject;
using StudentElectionSystem.Application.UseCases.Election.Cancel;
using StudentElectionSystem.Application.UseCases.Election.CloseVoting;
using StudentElectionSystem.Application.UseCases.Election.Create;
using StudentElectionSystem.Application.UseCases.Election.GetDetails;
using StudentElectionSystem.Application.UseCases.Election.GetList;
using StudentElectionSystem.Application.UseCases.Election.GetResults;
using StudentElectionSystem.Application.UseCases.Election.OpenNominations;
using StudentElectionSystem.Application.UseCases.Election.PublishResults;
using StudentElectionSystem.Application.UseCases.Election.Update;
using StudentElectionSystem.Application.UseCases.Student;
using StudentElectionSystem.Application.UseCases.Voting.CastVote;
using StudentElectionSystem.Application.UseCases.Voting.GetVotingCandidates;
using StudentElectionSystem.Application.UseCases.Voting.StartVoting;
using StudentElectionSystem.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Configuration options
builder.Services.Configure<AdminBootstrapSettings>(builder.Configuration.GetSection(AdminBootstrapSettings.SectionName));

// Routing
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});

// Exception handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Controllers and JSON Serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.Converters.Add(new UtcDateTimeJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new NullableUtcDateTimeJsonConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// Standardized Model State Validation Response
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => JsonNamingPolicy.CamelCase.ConvertName(kvp.Key),
                kvp => kvp.Value!.Errors.Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage) ? "Invalid value." : e.ErrorMessage).ToArray()
            );

        var response = new ApiResponse<object>(
            success: false,
            message: "Validation failed.",
            data: new { errors }
        );

        return new BadRequestObjectResult(response);
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Student Election System API", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            securityScheme,
            new string[] {}
        }
    });
});

builder.Services.AddAuthorization();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Application Use Cases
builder.Services.AddScoped<ILoginUseCase, LoginUseCase>();
builder.Services.AddScoped<IRegisterStudentUseCase, RegisterStudentUseCase>();
builder.Services.AddScoped<IGetPendingStudentsUseCase, GetPendingStudentsUseCase>();
builder.Services.AddScoped<IGetStudentDetailsUseCase, GetStudentDetailsUseCase>();
builder.Services.AddScoped<IApproveStudentUseCase, ApproveStudentUseCase>();
builder.Services.AddScoped<IRejectStudentUseCase, RejectStudentUseCase>();
builder.Services.AddScoped<ICreateElectionUseCase, CreateElectionUseCase>();
builder.Services.AddScoped<IGetElectionsUseCase, GetElectionsUseCase>();
builder.Services.AddScoped<IGetElectionDetailsUseCase, GetElectionDetailsUseCase>();
builder.Services.AddScoped<IUpdateElectionUseCase, UpdateElectionUseCase>();
builder.Services.AddScoped<ICancelElectionUseCase, CancelElectionUseCase>();
builder.Services.AddScoped<IOpenNominationsUseCase, OpenNominationsUseCase>();
builder.Services.AddScoped<IApplyCandidateUseCase, ApplyCandidateUseCase>();
builder.Services.AddScoped<IGetMyCandidateApplicationsUseCase, GetMyCandidateApplicationsUseCase>();
builder.Services.AddScoped<IGetPendingCandidatesUseCase, GetPendingCandidatesUseCase>();
builder.Services.AddScoped<IGetCandidateDetailsUseCase, GetCandidateDetailsUseCase>();
builder.Services.AddScoped<IApproveCandidateUseCase, ApproveCandidateUseCase>();
builder.Services.AddScoped<IRejectCandidateUseCase, RejectCandidateUseCase>();
builder.Services.AddScoped<IStartVotingUseCase, StartVotingUseCase>();
builder.Services.AddScoped<IGetVotingCandidatesUseCase, GetVotingCandidatesUseCase>();
builder.Services.AddScoped<ICastVoteUseCase, CastVoteUseCase>();
builder.Services.AddScoped<ICloseVotingUseCase, CloseVotingUseCase>();
builder.Services.AddScoped<IPublishResultsUseCase, PublishResultsUseCase>();
builder.Services.AddScoped<IGetElectionResultsUseCase, GetElectionResultsUseCase>();

// API-level services
builder.Services.AddScoped<ICurrentUserService, CurrentUserServiceImpl>();
builder.Services.AddScoped<IAdminBootstrapService, AdminBootstrapServiceImpl>();

var app = builder.Build();

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Student Election System API v1");
    });

    using var scope = app.Services.CreateScope();
    var bootstrapService = scope.ServiceProvider.GetRequiredService<IAdminBootstrapService>();
    await bootstrapService.EnsureAdminExistsAsync();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
