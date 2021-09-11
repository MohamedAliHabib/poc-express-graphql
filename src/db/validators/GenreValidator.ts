import Joi, {ValidationResult} from 'joi';
import IGenre from '../interfaces/IGenre';

export default function validate(genre: IGenre): ValidationResult {
  const schemaFields = {
    name: Joi.string().min(5).max(50).required(),
  };

  if (genre.id) {
    Object.assign(schemaFields, {
      id: (Joi as any).objectId().required(),
    });
  }

  const schema = Joi.object(schemaFields);
  return schema.validate(genre);
}
