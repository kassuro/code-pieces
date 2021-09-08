import { h } from '@nuxtjs/composition-api';

export const createSubmitButton = (
  buttonType: string,
  buttonPosition: string,
  label: string,
) => {
  let containerClass = 'is-flex';

  switch (buttonPosition) {
    case 'left':
      containerClass += ' is-justify-content-flex-start';
      break;
    case 'center':
      containerClass += ' is-justify-content-center';
      break;
    default:
      containerClass += ' is-justify-content-flex-end';
      break;
  }

  return h('div', { class: containerClass }, [
    h('b-button', {
      attrs: {
        'native-type': 'submit',
        type: buttonType,
        class: 'mt-5',
      },
      props: { label },
    }),
  ]);
};
