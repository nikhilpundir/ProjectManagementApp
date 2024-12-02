
export const verifyUser = async (req, res) => {
  try {
   res.status(200).send({success:true,message:"user authenticated"});
  } catch (err) {
    res.status(400).json({success:true, message: err.message });
  }
};

