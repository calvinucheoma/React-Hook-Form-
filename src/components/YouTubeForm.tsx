import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useEffect } from 'react';
// import { useEffect } from 'react';

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: { number: string }[];
  age: number;
  dob: Date;
};

const YouTubeForm = () => {
  // const form = useForm<FormValues>(); //we do not need to specify the type when using defaultValues but we need to specify it when we change defaultValues to a function

  // const form1 = useForm<FormValues>({
  //   defaultValues:  {
  //       username: 'Chukwuma',
  //       email: '',
  //       channel: '',
  //       social: {
  //         twitter: '',
  //         facebook: '',
  //       },
  //       phoneNumbers: ['', ''],
  //       phNumbers: [{ number: '' }],
  //       age: 0,
  //       dob: new Date(),

  //   },
  // });

  const form = useForm<FormValues>({
    defaultValues: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users/1'
      );
      const data = await response.json();
      return {
        username: 'Chukwuma',
        email: data.email,
        channel: '',
        social: {
          twitter: '',
          facebook: '',
        },
        phoneNumbers: ['', ''],
        phNumbers: [{ number: '' }],
        age: 0,
        dob: new Date(),
      };
    },
    // mode:'onSubmit',
    // mode: 'onBlur',
    // mode: 'onTouched',
    // mode: 'onChange',
    // mode: 'all',
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    /*watch,*/ getValues,
    setValue,
    reset,
    trigger,
  } = form;
  const {
    errors /*touchedFields, dirtyFields*/,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState;

  console.log('isSubmitting', isSubmitting);
  console.log('isSubmitted', isSubmitted);
  console.log('isSubmitSuccessful', isSubmitSuccessful);
  console.log('submitCount', submitCount);
  // console.log(touchedFields, dirtyFields, isDirty);
  // const { name, ref, onChange, onBlur } = register('username');

  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control: control,
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted', data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log('Form errors', errors);
  };

  const handleGetValues = () => {
    console.log('Get values', getValues('social'));
    // console.log(getValues('social'))
    //  console.log(getValues(['username','email']))
  };

  const handleSetValue = () => {
    setValue('username', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  // const watchUsername = watch('username');
  // const watchUsernameAndEmail = watch(['username', 'email']);
  // const watchForm = watch();
  //if we don't specify any argument, the entire form is being watched for changes in value

  renderCount++;

  return (
    <div>
      <h1>YouTube Form {renderCount / 2}</h1>
      {/* <h2>Watched Value: {JSON.stringify(watchForm)}</h2> */}
      {/* We divide by 2 because React.StrictMode renders components twice during development mode so it displays 2 instead of 1 */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: { value: true, message: 'Username is required' },
            })}
            // name={name}
            // ref={ref}
            // onChange={onChange}
            // onBlur={onBlur}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email format',
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== 'admin@example.com' ||
                    'Enter a different email address'
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith('baddomain.com') ||
                    'This domain is not supported'
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length == 0 || 'Email already exists';
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register('channel', {
              required: { value: true, message: 'Channel name is required' },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register('social.twitter', {
              disabled: true,
              required: 'Enter name',
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register('social.facebook')} />
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register('phoneNumbers.0')}
          />
          {/* Dot notation is used for consistency with typescript i.e phoneNumbers.0 instead of phoneNumbers[0] */}
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register('phoneNumbers.1')}
          />
          {/* Dot notation is used for consistency with typescript i.e phoneNumbers.0 instead of phoneNumbers[0] */}
        </div>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              //react-hook-form recommends the field.id as the key and not the index for correct behaviour
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: '' })}>
              Add phone number
            </button>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register('age', {
              valueAsNumber: true,
              required: { value: true, message: 'Age name is required' },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register('dob', {
              valueAsDate: true,
              required: { value: true, message: 'dob name is required' },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button type="submit" disabled={!isDirty || isValid || isSubmitting}>
          Submit
        </button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>
        <button type="button" onClick={handleSetValue}>
          Set Values
        </button>
        {/* <button type="button" onClick={() => trigger()}>
          Validate
        </button> */}
        <button type="button" onClick={() => trigger('channel')}>
          Validate Channel
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;
