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
import { validateText, validatePostLink } from "../../../services/input";

interface CreatePostRequest {
  link: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
}

/**
 * Administrator create new post (news) endpoint. Expected files parameters:
 * @param {string} req.files.postImage Posts's image to be uploaded (handled by multer)
 * @param {string} req.body.link Post's link
 * @param {string} req.body.title Post's title
 * @param {string?} req.body.subtitle Post's subtitle
 * @param {string} req.body.summary Post's summary
 * @param {string} req.body.content Post's content
 * @returns Message with info about failure or success
 */
export const createPost = async (req: Request, res: Response) => {
  let filePath: string, fileExtension: string;
  // Define path and file name for multer disk storage
  const postStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      filePath = path.join(process.cwd(), "public", "uploads", "post");
      cb(null, filePath);
    },
    filename: (req: Request, file, cb) => {
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
      const imageNamePattern = /^.+\.(png|jpeg|jpg)$/;
      const imageTypePattern = /^image\/(png|jpeg|jpg)$/;
      if (
        imageNamePattern.test(file.originalname.toLocaleLowerCase()) &&
        imageTypePattern.test(file.mimetype)
      ) {
        cb(null, true);
      } else {
        return cb(new Error("Επιλέξτε μόνο εικόνες τύπου .jpg, .jpeg ή .png"));
      }
    },
  });

  const uploadSingleImage = postUploadStorage.single("postImage");
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    try {
      const postData = req.body as CreatePostRequest;
      /* Check whether all required parameters are given and valid */
      // Link
      let isInvalid = validatePostLink(postData.link, postLinkLength);
      if (isInvalid) {
        await fs.promises.unlink(path.join(filePath, `1${fileExtension}`));
        return res.status(400).json({ message: `Σύνδεσμος: ${isInvalid}` });
      }

      // Title
      isInvalid = validateText(postData.title, postTitleLength);
      if (isInvalid) {
        await fs.promises.unlink(path.join(filePath, `1${fileExtension}`));
        return res.status(400).json({ message: `Τίτλος: ${isInvalid}` });
      }

      // Subtitle
      isInvalid = postData.subtitle
        ? validateText(postData.subtitle, postSubtitleLength)
        : null;
      if (isInvalid) {
        await fs.promises.unlink(path.join(filePath, `1${fileExtension}`));
        return res.status(400).json({ message: `Υπότιτλος: ${isInvalid}` });
      }

      // Summary
      isInvalid = validateText(postData.summary, postSummaryLength);
      if (isInvalid) {
        await fs.promises.unlink(path.join(filePath, `1${fileExtension}`));
        return res
          .status(400)
          .json({ message: `Σύντομη Περιγραφή: ${isInvalid}` });
      }

      // Content
      if (!postData.content || postData.content.trim().length === 0) {
        await fs.promises.unlink(path.join(filePath, `1${fileExtension}`));
        return res
          .status(400)
          .json({ message: "Το κείμενο του νέου δε γίνεται να είναι κενό" });
      }

      await pool.query(
        "INSERT INTO post (link, title, subtitle, summary, content) VALUES (?,?,?,?,?)",
        [
          postData.link,
          postData.title,
          postData.subtitle,
          postData.summary,
          postData.content,
        ]
      );

      await fs.promises.rename(
        path.join(filePath, `1${fileExtension}`),
        path.join(filePath, `${postData.link}${fileExtension}`)
      );

      return res.status(200).send({
        message: "Το νέο δημιουργήθηκε επιτυχώς.",
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
