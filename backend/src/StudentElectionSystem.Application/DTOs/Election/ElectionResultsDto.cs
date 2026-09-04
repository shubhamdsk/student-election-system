using System;
using System.Collections.Generic;

namespace StudentElectionSystem.Application.DTOs.Election;

public record ElectionResultsDto(
    Guid ElectionId,
    string ElectionTitle,
    string Status,
    int TotalVotes,
    bool IsTie,
    IEnumerable<ElectionResultCandidateDto> Candidates
);
