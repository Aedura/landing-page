/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document, Model } from "mongoose";

export type RoleType = "contributor" | "advisory";

export interface ContributorProfile {
  role: string;
  roleOther?: string;
  experienceText: string;
  technique: string;
  techniqueOther?: string;
}

export interface AdvisoryProfile {
  positionTitle: string;
  experienceYears: string;
  domain: string;
  lmsFeatures: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  roleType: RoleType;
  contributor?: ContributorProfile;
  advisory?: AdvisoryProfile;
  createdAt: Date;
  updatedAt: Date;
}

const contributorSchema = new Schema<ContributorProfile>(
  {
    role: { type: String, required: true },
    roleOther: { type: String },
    experienceText: { type: String, required: true },
    technique: { type: String, required: true },
    techniqueOther: { type: String },
  },
  { _id: false }
);

const advisorySchema = new Schema<AdvisoryProfile>(
  {
    positionTitle: { type: String, required: true },
    experienceYears: { type: String, required: true },
    domain: { type: String, required: true },
    lmsFeatures: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    roleType: {
      type: String,
      required: true,
      enum: ["contributor", "advisory"],
    },
    contributor: { type: contributorSchema },
    advisory: { type: advisorySchema },
  },
  {
    timestamps: true,
  }
);

let UserModel: Model<UserDocument>;

try {
  UserModel = mongoose.model<UserDocument>("user");
} catch (err) {
  UserModel = mongoose.model<UserDocument>("user", userSchema);
}

export default UserModel;
