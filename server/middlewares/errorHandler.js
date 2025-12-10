function errorHandler(error,req,res,next) {
  if (error.name === 'Unauthorized') {
    return res.status(401).json({message: error.message})
  }
  
  if (error.name === 'BadRequest') {
    return res.status(400).json({message: error.message})
  }

  if (error.name ==="Forbidden") {
        return res.status(403).json({message: error.message})
    }
  return res.status(500).json({message: "Internal Server Error"})
}

module.exports = errorHandler