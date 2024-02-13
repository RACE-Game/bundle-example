import { field, variant } from "@race-foundation/borsh"

const EVENT_TYPES = ['Bet', 'Check', 'Call', 'Fold', 'Raise'] as const
type EventType = typeof EVENT_TYPES[number]

export abstract class GameEvent {}

@variant(0)
export class Bet extends GameEvent {
  @field('u64')
  amount!: bigint

  event_type: EventType

  constructor(fields: any) {
    super()
    Object.assign(this, fields)
    this.event_type = EVENT_TYPES[0]
  }
}

@variant(1)
export class Check extends GameEvent {

  event_type: EventType

  constructor(_fields: any) {
    super()
    this.event_type = EVENT_TYPES[1]
  }
}

@variant(2)
export class Call extends GameEvent {

  event_type: EventType

  constructor(_fields: any) {
    super()
    this.event_type = EVENT_TYPES[2]
  }
}

@variant(3)
export class Fold extends GameEvent {

  event_type: EventType

  constructor(_fields: any) {
    super()
    this.event_type = EVENT_TYPES[3]
  }
}

@variant(4)
export class Raise extends GameEvent {
  @field('u64')
  amount!: bigint

  event_type: EventType

  constructor(fields: any) {
    super()
    Object.assign(this, fields)
    this.event_type = EVENT_TYPES[4]
  }
}
