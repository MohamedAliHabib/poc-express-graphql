import Joi, {ValidationResult} from 'joi';
import IMovie from '../interfaces/IMovie';

export default function validate(movie: IMovie): ValidationResult {
  const schemaFields = {
    name: Joi.string().min(5).max(255).required(),
    genreId: (Joi as any).objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };

  if (movie.id) {
    Object.assign(schemaFields, {
      id: (Joi as any).objectId().required(),
    });
  }

  const schema = Joi.object(schemaFields);
  return schema.validate(movie);
}
