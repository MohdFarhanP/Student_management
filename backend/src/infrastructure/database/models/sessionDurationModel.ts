import mongoose, { Schema } from "mongoose";
import { ISessionDurationDocument } from "../../../domain/interface/ISessionDurationDocument";

const SessionDurationShema = new Schema<ISessionDurationDocument>({
    userId:{type: String},
    sessionId:{type: String},
    durationSeconds: {type: Number},
    joinTime: {type: Date},
    leaveTime: {type: Date},
})

export const SessionDurationModel = mongoose.model('SessionDuration',SessionDurationShema)