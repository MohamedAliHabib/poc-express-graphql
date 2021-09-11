import {Types} from 'mongoose';

export default function validateID(id: Types.ObjectId): void {
  if (!id) {
    throw new Error('id must be provided');
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid id');
  }
}
