import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({
  timestamps: true,
  versionKey: false
})
export class User {
  @Prop({ required: true })
  email: string

  @Prop({ required: true, select: false })
  password: string

  @Prop()
  name: string

  @Prop({ type: Date })
  createdAt: Date

  @Prop({ type: Date })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
