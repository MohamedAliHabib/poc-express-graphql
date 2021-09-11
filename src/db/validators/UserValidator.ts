import Joi, {ValidationResult} from 'joi';
import IUser from '../interfaces/IUser';

export default function validate(user: IUser): ValidationResult {
  const schemaFields = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(), // user sent prd
    age: Joi.number().min(8).required(),
    phone: Joi.string().min(5).max(20).required(),
  };

  if (user.id) {
    Object.assign(schemaFields, {
      id: (Joi as any).objectId().required(),
    });
  }

  const schema = Joi.object(schemaFields);
  return schema.validate(user);
}
