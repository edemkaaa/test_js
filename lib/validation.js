import * as yup from 'yup';

export const validateEvent = async (data) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    date_periods: yup.array().of(
      yup.object().shape({
        start: yup.string().required(),
        end: yup.string().required(),
      })
    ).required(),
    venue: yup.object().shape({
      name: yup.string().required(),
      country: yup.string(),
      state: yup.string(),
      city: yup.string(),
      timezone: yup.string().required(),
      zip_code: yup.string(),
      address: yup.string()
    }).required(),
    thumbnail: yup.string(),
    status: yup.string().oneOf(['ACTIVE', 'POSTPONED', 'APPROVED', 'UNAPPROVED', 'SUSPENDED', 'REMOVED']).required(),
  });

  await schema.validate(data);
};