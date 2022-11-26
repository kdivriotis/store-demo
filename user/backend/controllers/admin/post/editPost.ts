import path from "path";
import fs from "fs";

import { Response } from "express";
import multer from "multer";

import { Request } from "../../../interfaces/Request";

import {
  postLinkLength,
  postTitleLength,
  postSubtitleLength,
  postSummaryLength,
} from "../../../constants";

import { pool } from "../../../services/database";
import { deleteImage } from "../../../services/files";
import { validateText, validatePostLink } from "../../../services/input";

interface EditPostRequest {
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
}

interface UrlParameters {
  link: string;
}

/**
 * Administrator edit post (news) endpoint. Expected files parameters:
 * @param {string} req.params.link The unique link of the post to be edited
 * @param {string} req.files.postImage? Posts's image to be uploaded (handled by multer) (optional)
 * @param {string} req.body.title Post's title
 * @param {string?} req.body.subtitle Post's subtitle
 * @param {string} req.body.summary Post's summary
 * @param {string} req.body.content Post's content
 * @returns Message with info about failure or success
 */
export const editPost = async (req: Request, res: Response) => {
  const { link } = req.params as unknown as UrlParameters;

  if (!link) {
    return res.status(400).json({
      message: "Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.",
    });
  }

  let filePath: string, fileExtension: string;
  // Define path and file name for multer disk storage
  const postStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      if (!file) return cb(null, "");
      filePath = path.join(process.cwd(), "public", "uploads", "post");
      cb(null, filePath);
    },
    filename: (req: Request, file, cb) => {
      if (!file) return cb(null, `1.png`);
      fileExtension = path.extname(file.originalname.toLocaleLowerCase());
      cb(null, `1${path.extname(file.originalname.toLocaleLowerCase())}`);
    },
  });

  const postUploadStorage = multer({
    storage: postStorage,
    limits: {
      fileSize: 4 * 1024 * 1024, // 4 MB
    },
    fileFilter: (req, file, cb) => {
      if (!file) {
        return cb(new Error("Skipped Image"));
      }

      const imageNamePattern = /^.+\.(png|jpeg|jpg)$/;
      const imageTypePattern = /^image\/(png|jpeg|jpg)$/;
      if (
        imageNamePattern.test(file.originalname.toLocaleLowerCase()) &&
        imageTypePattern.test(file.mimetype)
      ) {
        return cb(null, true);
      } else {
        return cb(new Error("Επιλέξτε μόνο εικόνες τύπου .jpg, .jpeg ή .png"));
      }
    },
  });

  const uploadSingleImage = postUploadStorage.single("postImage");
  uploadSingleImage(req, res, async (err) => {
    if (err && err.message !== "Skipped Image") {
      return res.status(400).send({ message: err.message });
    }

    try {
      const postData = req.body as EditPostRequest;
      /* Check whether all required parameters are given and valid */
      // Link
      let isInvalid = validatePostLink(link, postLinkLength);
      if (isInvalid) {
        return res.status(400).json({ message: `Σύνδεσμος: ${isInvalid}` });
      }

      // Title
      isInvalid = validateText(postData.title, postTitleLength);
      if (isInvalid) {
        return res.status(400).json({ message: `Τίτλος: ${isInvalid}` });
      }

      // Subtitle
      isInvalid = postData.subtitle
        ? validateText(postData.subtitle, postSubtitleLength)
        : null;
      if (isInvalid) {
        return res.status(400).json({ message: `Υπότιτλος: ${isInvalid}` });
      }

      // Summary
      isInvalid = validateText(postData.summary, postSummaryLength);
      if (isInvalid) {
        return res
          .status(400)
          .json({ message: `Σύντομη Περιγραφή: ${isInvalid}` });
      }

      // Content
      if (!postData.content || postData.content.trim().length === 0) {
        return res
          .status(400)
          .json({ message: "Το κείμενο του νέου δε γίνεται να είναι κενό" });
      }

      await pool.query(
        "UPDATE post SET title=?, subtitle=?, summary=?, content=? WHERE link=?",
        [
          postData.title,
          postData.subtitle,
          postData.summary,
          postData.content,
          link,
        ]
      );

      if (filePath && fileExtension) {
        // delete current image (if it exists & a new image is uploaded)
        await deleteImage("post", link);

        // rename uploaded image to <link>.(jpg|jpeg|png)
        await fs.promises.rename(
          path.join(filePath, `1${fileExtension}`),
          path.join(filePath, `${link}${fileExtension}`)
        );
      }

      return res.status(200).send({
        message: "Το νέο ενημερώθηκε ολοκληρώθηκε επιτυχώς.",
      });
    } catch (error: any) {
      // On database failure, return
      await fs.promises.unlink(path.join(filePath, `1${fileExtension}`));
      return res.status(500).json({
        message: `Προέκυψε κάποιο σφάλμα, παρακαλούμε προσπαθήστε ξανά.\n
${error.toString()}`,
      });
    }
  });
};
