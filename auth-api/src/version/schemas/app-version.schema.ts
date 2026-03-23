import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppVersionDocument = AppVersion & Document;

@Schema({ timestamps: true })
export class AppVersion {
  @Prop({ required: true, unique: true, default: 'app' })
  key: string;

  @Prop({ required: true })
  latestVersion: string;
}

export const AppVersionSchema = SchemaFactory.createForClass(AppVersion);
