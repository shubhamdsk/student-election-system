using Microsoft.EntityFrameworkCore;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Application.Common.Models;
using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Infrastructure.Persistence.Repositories;

public class StudentRepository : IStudentRepository
{
    private readonly AppDbContext _dbContext;

    public StudentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> ExistsByRegistrationNumberAsync(string registrationNumber, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Students
            .AnyAsync(s => s.RegistrationNumber == registrationNumber, cancellationToken);
    }

    public async Task AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        await _dbContext.Students.AddAsync(student, cancellationToken);
    }

    public async Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Students
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<PagedResult<PendingStudentDto>> GetPendingStudentsAsync(int pageNumber, int pageSize, string? search, CancellationToken cancellationToken = default)
    {
        var query = from s in _dbContext.Students
                    join u in _dbContext.Users on s.UserId equals u.Id
                    where s.ApprovalStatus == ApprovalStatus.Pending
                    select new { s, u.Email };

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(x => 
                x.s.FullName.Contains(search) || 
                x.s.RegistrationNumber.Contains(search) || 
                x.Email.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(x => x.s.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new PendingStudentDto
            {
                StudentId = x.s.Id,
                UserId = x.s.UserId,
                RegistrationNumber = x.s.RegistrationNumber,
                FullName = x.s.FullName,
                Email = x.Email,
                Department = x.s.Department,
                YearOfStudy = x.s.YearOfStudy,
                ApprovalStatus = x.s.ApprovalStatus,
                CreatedAt = x.s.CreatedAt
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new PagedResult<PendingStudentDto>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<StudentDetailsDto?> GetStudentDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var query = from s in _dbContext.Students
                    join u in _dbContext.Users on s.UserId equals u.Id
                    where s.Id == id
                    select new StudentDetailsDto
                    {
                        StudentId = s.Id,
                        UserId = s.UserId,
                        RegistrationNumber = s.RegistrationNumber,
                        FullName = s.FullName,
                        Email = u.Email,
                        Department = s.Department,
                        YearOfStudy = s.YearOfStudy,
                        Gender = s.Gender,
                        PhoneNumber = s.PhoneNumber,
                        ApprovalStatus = s.ApprovalStatus,
                        CreatedAt = s.CreatedAt,
                        ApprovedAt = s.ApprovedAt,
                        RejectedAt = s.RejectedAt,
                        RejectionReason = s.RejectionReason
                    };

        return await query.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
