import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { checkImage } from "../../services/files";

const baseUrl = process.env.BASE_URL;

interface PostResponse {
  title: string;
  subtitle: string;
  content: string;
}

interface Post {
  link: string;
  title: string;
  subtitle: string;
  summary?: string;
  content: string;
  mainImage: string | undefined | null;
}

interface UrlParameters {
  link: string;
}

/**
 * Get details about a specific post based on its link
 * @param {string} req.params.link The unique link of the post to get details for
 * @returns Message in case of failure, or { post: Post } in case of success
 */
export const getPostDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { link } = req.params as unknown as UrlParameters;

  if (!link) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT link, title, subtitle, summary, content FROM post WHERE link=? LIMIT 1`,
      [link]
    );

    const postsResponse = result[0] as PostResponse[];
    if (!postsResponse || postsResponse.length === 0) {
      return res.status(400).json({
        message:
          "Δεν υπάρχουν δεδομένα, βεβαιωθείτε ότι ο σύνδεσμος είναι σωστός και προσπαθήστε ξανά.",
      });
    }
    const imageName = await checkImage("post", link);
    const post: Post = {
      link,
      ...postsResponse[0],
      mainImage: imageName ? `${baseUrl}/uploads/post/${imageName}` : null,
    };

    return res.status(200).json({ post });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
