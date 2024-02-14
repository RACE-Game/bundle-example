export const PLAYER_STATUSES = ['Wait', 'Acted', 'Acting', 'Allin', 'Fold', 'Init', 'Leave', 'Out']
export type PlayerStatus = typeof PLAYER_STATUSES[number]

export const HOLDEM_STAGES = ['Init', 'ShareKey', 'Play', 'Runner', 'Settle', 'Showdown'] as const
export type HoldemStage = typeof HOLDEM_STAGES[number]

export const STREETS = ['Init', 'Preflop', 'Flop', 'Turn', 'River', 'Showdown']
export type Street = typeof STREETS[number]

export const GAME_MODES = ['Cash', 'Sng', 'Mtt']
export type GameMode = typeof GAME_MODES[number]

export const BLIND_TYPES = ['Sb', 'Bb', 'Ante', 'Stradle']
export type BlindType = typeof BLIND_TYPES[number]
