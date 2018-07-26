const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require ('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

        router.post('/newBlog', (req, res) => {
                // Check if blog title was provided
                if (!req.body.title) {
                  res.json({ success: false, message: 'Blog title is required.' }); // Return error message
                } else {
                  // Check if blog body was provided
                  if (!req.body.body) {
                    res.json({ success: false, message: 'Blog body is required.' }); // Return error message
                  } else {
                    // Check if blog's creator was provided
                    if (!req.body.createdBy) {
                      res.json({ success: false, message: 'Blog creator is required.' }); // Return error
                    } else {
                      // Create the blog object for insertion into database
                      const blog = new Blog({
                        title: req.body.title, // Title field
                        body: req.body.body, // Body field
                        createdBy: req.body.createdBy // CreatedBy field
                      });
                      // Save blog into database
                      blog.save((err) => {
                        // Check if error
                        if (err) {
                          // Check if error is a validation error
                          if (err.errors) {
                            // Check if validation error is in the title field
                            if (err.errors.title) {
                              res.json({ success: false, message: err.errors.title.message }); // Return error message
                            } else {
                              // Check if validation error is in the body field
                              if (err.errors.body) {
                                res.json({ success: false, message: err.errors.body.message }); // Return error message
                              } else {
                                res.json({ success: false, message: err }); // Return general error message
                              }
                            }
                          } else {
                            res.json({ success: false, message: err }); // Return general error message
                          }
                        } else {
                          res.json({ success: true, message: 'Blog saved!' }); // Return success message
                        }
                      });
                    }
                  }
                }
              });
            

              router.get('/AllBlogs',(req, res) => {
                 
                Blog.find({}, (err, blogs) =>{
                    if(err){
                      res.json({success: false, message: err});
                    }else{
                      if(!blogs){
                        res.json({success: false, message: 'No blogs found'});
                      }else{
                        res.json({ success: true, blogs});
                      }
                    }
                }).sort({'_id': -1});
              });


              router.get('/singleBlog/:id', (req, res) =>{
                  if(!req.params.id){
                    res.json({success: false, message: 'No blog Id was provided'});
                  } else {
                    Blog.findOne({_id: req.params.id}, (err, blog) => {
                      if(err){
                        res.json({success: false, message: 'Not a valid blog Id'});
                      }else{
                        if(!blog){
                          res.json({success: false, message: 'Blog not found'});
                        }else{
                          User.findOne({_id: req.decoded.userId}, (err, user) =>{
                            if(err){
                              res.json({success: false, message: err});
                            }else{
                              if(!user){
                                res.json({success: false, messages: 'Unable to authenticate user'});
                              }else{
                                if(user.username !== blog.createdBy){
                                  res.json({success: false, message: 'You are not authorized to edit this blog post'});
                                }else{
                                  res.json({success: true, blog: blog});
                                }
                              }
                            }
                          });
                        }
                      }
                    });
                  }
              });

              router.put('/updateBlog', (req, res) =>{
                if(!req.body._id){
                  res.json({success: false, message: 'No blog provided!'});
                }else{
                  Blog.findOne({_id: req.body._id}, (err, blog) => {
                    if(err){
                      res.json({success: false, message: 'NOt a valid blog Id'});
                    }else{
                      if(!blog){
                          res.json({success: false, message: 'Blog Id was not found'});
                      }else{
                        User.findOne({_id: req.decoded.userId}, (err, user) => {
                            if(err){
                              res.json({success: false, message: err});
                            }else{
                               if(!user){
                                 res.json({success: false, message: 'Unable to authenticate user'});
                               }else{
                                 if(user.username !== blog.createdBy){
                                   res.json({success: false, message: 'You are not authorized to edit this blog'});
                                 }else {
                                   blog.title = req.body.title;
                                   blog.body = req.body.body;
                                   blog.save((err) =>{
                                     if(err){
                                       res.json({success: false, message: err});                         
                                     }else{
                                       res.json({success: true, message: 'Blog Updated!'});
                                     }
                                   });
                                 }
                               }
                            }
                        });
                      }
                    }
                  });
                }
              });

              router.delete('/deleteBlog/:id',(req, res) => {
                if(!req.params.id){
                  res.json({success: false, message: 'NO Id provided!'});
                }else {
                  Blog.findOne({_id: req.params.id}, (err, blog) =>{
                      if(err){
                        res.json({success: false, message: 'Invalid Id'});
                      }else{
                        if(!blog){
                          res.json({success: false, message: 'Id was not found'});
                        }else{
                          User.findOne({_id: req.decoded.userId}, (err, user) =>{
                              if(err){
                                res.json({success: false, message: err});
                              }else{
                                if(!user){
                                  res.json({success: false, message: 'Unable to authorize user'});
                                }else{
                                  if(user.username !== blog.createdBy){
                                    res.json({ success: false, message: 'You are not authorize to delete this' });
                                  }else{
                                    blog.remove((err) =>{
                                      if(err){
                                        res.json({success: false, message: err});
                                      }else{
                                        res.json({success: true, message: 'Blog deleted!'});
                                      }
                                    });
                                  }
                                }
                              }
                          });
                        }
                      }
                  });
                }
              });

              router.put('/likeBlog', (req, res) =>{
                    if(!req.body.id){
                      res.json({success: false, message: 'No id was provided'});
                    }else{
                      Blog.findOne({_id: req.body.id}, (err, blog) =>{
                          if(err){
                            res.json({success: false, message: 'Invalid blog id'});
                          }else{
                            if(!blog){
                              res.json({success: false, message: 'That blog not found'});
                            }else{
                              User.findOne({_id: req.decoded.userId}, (err, user)=>{
                                if(err){
                                  res.json({success: false, message: 'Something went wrong'});
                                }else{
                                  if(!user){
                                    res.json({ success: false, message: 'Could not authenticate user'});
                                  }else{
                                    if(user.username ===blog.createdBy){
                                      res.json({success: false, message: 'Cannot like your own post'});
                                    }else{
                                      if(blog.likedBy.includes(user.username)){
                                        res.json({success: false, message: 'You alredy liked this post'});
                                      }else{
                                        if(blog.dislikedBy.includes(user.username)){
                                          blog.dislikes--;
                                          const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                          blog.dislikedBy.splice(arrayIndex, 1);
                                          blog.likes++;
                                          blog.likedBy.push(user.username);
                                          blog.save((err) => {
                                            if(err){
                                              res.json({success: false, message: 'Something went wrong'});
                                            }else{
                                              res.json({success: true, message: 'Blog Liked!'});
                                            }
                                          });
                                        } else{
                                          blog.likes++;
                                          blog.likedBy.push(user.username);
                                          blog.save((err) => {
                                            if(err){
                                              res.json({success: false, message: 'Something went wrong'});
                                            }else{
                                              res.json({success: true, message: 'Blog Liked!'});
                                            }
                                          });
                                        }
                                      }
                                    }
                                  }
                                }
                              });
                            }
                          }
                       });
                    }
                });

                
              router.put('/dislikeBlog', (req, res) =>{
                if(!req.body.id){
                  res.json({success: false, message: 'No id was provided'});
                }else{
                  Blog.findOne({_id: req.body.id}, (err, blog) =>{
                      if(err){
                        res.json({success: false, message: 'Invalid blog id'});
                      }else{
                        if(!blog){
                          res.json({success: false, message: 'That blog not found'});
                        }else{
                          User.findOne({_id: req.decoded.userId}, (err, user)=>{
                            if(err){
                              res.json({success: false, message: 'Something went wrong'});
                            }else{
                              if(!user){
                                res.json({ success: false, message: 'Could not authenticate user'});
                              }else{
                                if(user.username ===blog.createdBy){
                                  res.json({success: false, message: 'Cannot dislike your own post'});
                                }else{
                                  if(blog.dislikedBy.includes(user.username)){
                                    res.json({success: false, message: 'You alredy disliked this post'});
                                  }else{
                                    if(blog.likedBy.includes(user.username)){
                                      blog.likes--;
                                      const arrayIndex = blog.likedBy.indexOf(user.username);
                                      blog.likedBy.splice(arrayIndex, 1);
                                      blog.dislikes++;
                                      blog.dislikedBy.push(user.username);
                                      blog.save((err) => {
                                        if(err){
                                          res.json({success: false, message: 'Something went wrong'});
                                        }else{
                                          res.json({success: true, message: 'Blog Disliked!'});
                                        }
                                      });
                                    } else{
                                      blog.dislikes++;
                                      blog.dislikedBy.push(user.username);
                                      blog.save((err) => {
                                        if(err){
                                          res.json({success: false, message: 'Something went wrong'});
                                        }else{
                                          res.json({success: true, message: 'Blog Disliked!'});
                                        }
                                      });
                                    }
                                  }
                                }
                              }
                            }
                          });
                        }
                      }
                   });
                }
            });
              return router;
            };