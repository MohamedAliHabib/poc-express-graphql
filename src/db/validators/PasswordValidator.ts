import passwordComplexity from 'joi-password-complexity';

export default function validate(password: string): void {
  const complexityOptions = {
    min: 8,
    max: 15,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 5,
  };

  const {error} = passwordComplexity(complexityOptions).validate(password);
  if (error) {
    // const message = error.details.map((err: any) => err.message).join(', ')
    // throw new Error(['Password error', message].join(': '));
    throw new Error([
      'Password must contain at least 8 characters',
      'and must include at least 1 lower-case letter,',
      '1 capital-case letter, 1 number, and 1 symbol.',
    ].join(' '));
  }
}
