async function isStaff(req,res,next) {
  try {
    if (req.user.role !== 'Staff') {
      throw {name: 'Forbidden', message: 'You are not allowed to access this resource'}
    }
    return next()
  } catch (error) {
    next(error)
  }
}
module.exports = isStaff