using System;
using System.Collections.Generic;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.DTOs.Election;

public record ElectionResultsDto(
    Guid ElectionId,
    string ElectionTitle,
    ElectionStatus Status,
    int TotalVotes,
    bool IsTie,
    IEnumerable<ElectionResultCandidateDto> Candidates
);
