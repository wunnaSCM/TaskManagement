import React from 'react';
import { classNames } from '@/lib/helper';

export default function Button({
  children,
  type = 'button',
  samePadding = false,
  secondary = false,
  tertiary = false,
  onClick,
  className,
}: {
  children: JSX.Element | string;
  type?: 'button' | 'submit' | 'reset';
  samePadding?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) {
  let buttonStyle =
    'text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 px-5 py-2.5';

  if (secondary) {
    buttonStyle =
      'text-primary hover:text-white border border-primary hover:bg-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center';
  }

  if (tertiary) {
    buttonStyle =
      'text-primary hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center';
  }

  if (samePadding) {
    buttonStyle = classNames(buttonStyle, 'px-2.5');
  }

  buttonStyle = classNames(buttonStyle, className ? className : '');

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} onClick={onClick} className={buttonStyle}>
      {children}
    </button>
  );
}
