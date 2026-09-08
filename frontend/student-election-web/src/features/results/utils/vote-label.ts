export function formatVoteCount(voteCount: number): string {
  return `${voteCount} ${voteCount === 1 ? 'vote' : 'votes'}`
}
