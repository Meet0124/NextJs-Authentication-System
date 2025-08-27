import  {NextRequest} from "next/server";
import jwt from "jsonwebtoken";

// Lines 8, 10 - Fix any types
export const getDataFromToken = (request: NextRequest): string => {
  try {
    const token = request.cookies.get("token")?.value || '';
    
    interface DecodedToken {
      id: string;
      username: string;
      email: string;
    }
    
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;
    return decodedToken.id;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
    throw new Error(errorMessage);
  }
}