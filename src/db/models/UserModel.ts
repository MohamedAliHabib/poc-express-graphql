
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import config from 'config';
import IUser from '../interfaces/IUser';

export const userSchema: mongoose.Schema<IUser> = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024, // hash is long
  },
  age: {
    type: Number,
    required: true,
    min: 8,
  },
  phone: {
    type: String,
    minlength: 5,
    maxlength: 20,
  },
  isAdmin: Boolean,
});

// following the Single Responsibility Principle
userSchema.methods.generateAuthToken = function(this: IUser) {
  const token = jsonwebtoken.sign({
    _id: this._id,
    isAdmin: this.isAdmin,
  },
  config.get('jwtPrivateKey'),
  {expiresIn: '30min'});
  return token;
};

userSchema.methods.generateAuthRefToken = function(this: IUser) {
  const token = jsonwebtoken.sign({_id: this._id},
      config.get('jwtPrivateKey'), {expiresIn: '7d'});
  return token;
};

const User: mongoose.Model<IUser> = mongoose.model('Users', userSchema);

export default User;
