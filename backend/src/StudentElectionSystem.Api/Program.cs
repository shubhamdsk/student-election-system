using Microsoft.AspNetCore.Authentication.JwtBearer;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Application.UseCases.Authentication;
using StudentElectionSystem.Application.UseCases.Student;
using StudentElectionSystem.Application.UseCases.Election.Create;
using StudentElectionSystem.Application.UseCases.Election.GetList;
using StudentElectionSystem.Application.UseCases.Election.GetDetails;
using StudentElectionSystem.Application.UseCases.Election.Update;
using StudentElectionSystem.Application.UseCases.Election.Cancel;
using StudentElectionSystem.Infrastructure;
using StudentElectionSystem.Api.Configuration;
using StudentElectionSystem.Api.Services;


using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.Configure<AdminBootstrapSettings>(builder.Configuration.GetSection(AdminBootstrapSettings.SectionName));

builder.Services.AddControllers();

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

// Application Services Composition Root
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
builder.Services.AddScoped<ICurrentUserService, StudentElectionSystem.Api.Services.CurrentUserServiceImpl>();
builder.Services.AddScoped<IAdminBootstrapService, AdminBootstrapServiceImpl>();

var app = builder.Build();


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
