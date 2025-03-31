import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

let blacklist = [];

export function hashPassword(password) {
  return bcrypt.hashSync(password, parseInt(process.env.BCRYPT_ROUNDS));
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}


export function generateToken(user) {
  return jwt.sign(
      {
          id: user.id,
          email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY_TIME }
  );
}

export function generateRefreshToken(object) {
    return jwt.sign(object, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TIME,
    });
  }

  export function verifyToken(authorization) {
    if (!authorization) {
      //console.log("No authorization token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization;
    //console.log("Token received:", token);

    if (blacklist.includes(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      //console.log("Error verifying token:", error);
      return null;
    }
  }

export function verifyRefreshToken(authorization) {
  
    if (!authorization) {
        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            { status: 401 },
        );
    }
    const token = authorization.split(" ")[1];
    if (!token || blacklist.includes(token)) {
        return NextResponse.json(
            {
            error: "Unauthorized",
            },
            { status: 401 },
        );
        }

    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
}

export function invalidateToken(token) {
  blacklist.push(token);
}
