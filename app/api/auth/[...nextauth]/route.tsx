/* eslint-disable import/no-anonymous-default-export */
import NextAuth from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth";

const handler = NextAuth(authOptions);

export default (req: NextApiRequest, res: NextApiResponse) => handler(req, res);