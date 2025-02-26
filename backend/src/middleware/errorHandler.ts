export const errorHandler = (err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  };