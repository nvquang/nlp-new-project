import Post from '../models/post';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

var AYLIENTextAPI = require('aylien_textapi');

var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var download = require('download-file')

var MonkeyLearn = require('monkeylearn');

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function aspectsBased(req, res) {
  if (!req.body.query.text || !req.body.query.domain) {
    res.status(403).end();
  }

  var textapi = new AYLIENTextAPI({
    application_id: "d0610e54",
    application_key: "8e347bee6e64f01c958cd32738604d53"
  });

  textapi.aspectBasedSentiment({
    'domain': req.body.query.domain,
    'text': req.body.query.text
  }, function(err, response) {
    if (err === null) {
      res.json({"aspectBased": response})
    }
  });
}
