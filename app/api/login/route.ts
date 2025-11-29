/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "../../../lib/connector";
import UserModel, { RoleType } from "../../../models/user";
import { signAuthToken, AuthTokenPayload } from "../../../lib/auth";

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;
  roleType?: RoleType;
  contributor?: {
    role?: string;
    roleOther?: string;
    experienceText?: string;
    technique?: string;
    techniqueOther?: string;
  };
  advisory?: {
    positionTitle?: string;
    experienceYears?: string;
    domain?: string;
    lmsFeatures?: string;
  };
}

const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

function toSafeUser(doc: any): AuthTokenPayload {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    roleType: doc.roleType,
  };
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function invalidSignupPayload(body: SignupBody): string | null {
  if (!body.name || !body.name.trim()) return "Name is required";
  if (!body.email || !body.email.trim()) return "Email is required";
  if (!body.password || body.password.length < 8)
    return "Password must be at least 8 characters";
  if (!body.roleType) return "Role type is required";

  if (body.roleType === "contributor") {
    const contributor = body.contributor;
    if (!contributor) return "Contributor details are required";
    if (!contributor.role) return "Contributor role is required";
    if (contributor.role === "other" && !contributor.roleOther?.trim())
      return "Contributor role (other) is required";
    if (!contributor.experienceText?.trim())
      return "Contributor experience is required";
    if (!contributor.technique) return "Contributor technique is required";
    if (
      contributor.technique === "other" &&
      !contributor.techniqueOther?.trim()
    )
      return "Contributor technique (other) is required";
  }

  if (body.roleType === "advisory") {
    const advisory = body.advisory;
    if (!advisory) return "Advisory details are required";
    if (!advisory.positionTitle?.trim()) return "Position title is required";
    if (!advisory.experienceYears?.trim()) return "Experience is required";
    if (!advisory.domain?.trim()) return "Domain is required";
    if (!advisory.lmsFeatures?.trim()) return "Feature feedback is required";
  }

  return null;
}

function buildContributor(body: SignupBody) {
  if (body.roleType !== "contributor" || !body.contributor) return undefined;
  const { role, roleOther, experienceText, technique, techniqueOther } =
    body.contributor;
  return {
    role: role!,
    roleOther: role === "other" ? roleOther?.trim() : undefined,
    experienceText: experienceText!.trim(),
    technique: technique!,
    techniqueOther: technique === "other" ? techniqueOther?.trim() : undefined,
  };
}

function buildAdvisory(body: SignupBody) {
  if (body.roleType !== "advisory" || !body.advisory) return undefined;
  const { positionTitle, experienceYears, domain, lmsFeatures } = body.advisory;
  return {
    positionTitle: positionTitle!.trim(),
    experienceYears: experienceYears!.trim(),
    domain: domain!.trim(),
    lmsFeatures: lmsFeatures!.trim(),
  };
}

function setAuthCookie(
  response: NextResponse,
  token: string,
  rememberSession: boolean
) {
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  if (rememberSession) {
    response.cookies.set("token", token, {
      ...base,
      maxAge: COOKIE_MAX_AGE,
    });
    return;
  }

  response.cookies.set("token", token, base);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = (await req.json().catch(() => null)) as SignupBody | null;
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const validationError = invalidSignupPayload(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const email = normaliseEmail(body.email!);
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(body.password!, 12);

    const userDoc = await UserModel.create({
      name: body.name!.trim(),
      email,
      passwordHash,
      roleType: body.roleType!,
      contributor: buildContributor(body),
      advisory: buildAdvisory(body),
    });

    const safeUser = toSafeUser(userDoc);
    const token = signAuthToken(safeUser);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
    });

    setAuthCookie(response, token, true);

    return response;
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// NOTE: GET for login is insecure because credentials appear in logs and caches.
// Prefer POST /api/login in production environments.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const emailParam = req.nextUrl.searchParams.get("email") ?? "";
    const passwordParam = req.nextUrl.searchParams.get("password") ?? "";

    if (!emailParam || !passwordParam) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const email = normaliseEmail(emailParam);
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      passwordParam,
      userDoc.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const safeUser = toSafeUser(userDoc);
    const token = signAuthToken(safeUser);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
    });

    const rememberSession = req.nextUrl.searchParams.get("remember") === "true";

    setAuthCookie(response, token, rememberSession);

    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
