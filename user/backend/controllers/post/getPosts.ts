import { Response } from "express";

import { Request } from "../../interfaces/Request";

import { pool } from "../../services/database";
import { checkImage } from "../../services/files";

const baseUrl = process.env.BASE_URL;

interface PostCountResponse {
  numberOfPosts: number;
}

interface PostResponse {
  link: string;
  title: string;
  summary: string;
}

interface Post {
  link: string;
  title: string;
  summary: string;
  mainImage: string | undefined | null;
}

interface UrlParameters {
  offset: string;
  limit: string;
}

/**
 * Get all posts and their images:
 * @param {number} req.params.offset The offset of posts for query (used for pagination)
 * @param {number} req.params.limit The limit of posts for query (used for pagination)
 * @returns Message in case of failure, or { numberOfPosts, posts: Post[] } in case of success
 */
export const getPosts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { offset, limit } = req.params as unknown as UrlParameters;

  if (!offset || isNaN(parseInt(offset)) || !limit || isNaN(parseInt(limit))) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  try {
    const countResult = await pool.query(
      "SELECT COUNT(*) AS numberOfPosts FROM post"
    );
    const totalPosts = countResult[0] as PostCountResponse[];
    if (totalPosts.length === 0) {
      return res.status(200).json({
        numberOfPosts: 0,
        posts: [],
      });
    }
    const numberOfPosts: number = totalPosts[0].numberOfPosts;

    const result = await pool.query(
      `SELECT link, title, summary
      FROM post
      ORDER BY post_date DESC
      LIMIT ?, ?`,
      [parseInt(offset), parseInt(limit)]
    );

    const postsResponse = result[0] as PostResponse[];
    let posts: Post[] = [];
    for (let post of postsResponse) {
      const imageName = await checkImage("post", post.link);
      posts.push({
        ...post,
        mainImage: imageName ? `${baseUrl}/uploads/post/${imageName}` : null,
      });
    }

    return res.status(200).json({ numberOfPosts, posts });
  } catch (error) {
    // On database failure, return
    return res.status(500).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }
};
