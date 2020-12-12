import React from 'react';
import {
  ChevronIconDown,
  ChevronIconRight,
  CopyIcon,
  EyeIcon,
  PencilIcon,
  PrintIcon,
  UndoIcon,
} from './Icons';

interface ActionButtonTypes {
  caption?: string;
  className?: string;
  fill?: string;
  id?: string;
  title: string;
  onClick: () => void;
}

interface ConditionalButtonTypes extends ActionButtonTypes {
  condition?: boolean | undefined;
  messageOn?: string;
  messageOff?: string;
}

export const ChevronToggleButton: React.FC<ConditionalButtonTypes> = ({
  caption,
  className,
  condition,
  onClick,
  title,
}) => (
  <button className={className} onClick={onClick} title={title}>
    {condition ? (
      <ChevronIconDown role="button" />
    ) : (
      <ChevronIconRight role="button" />
    )}
    <p className={'chevron-button-caption'}>{caption}</p>
  </button>
);

export const CopyButton: React.FC<ActionButtonTypes> = ({
  caption,
  className,
  fill,
  onClick,
  title,
}) => (
  <button className={className} onClick={onClick} title={title}>
    <CopyIcon fill={fill} role={'button'} />
    <span className="button-caption">{caption}</span>
  </button>
);

export const EyeButton: React.FC<ConditionalButtonTypes> = ({
  caption,
  className,
  condition,
  messageOn,
  messageOff,
  onClick,
  title,
}) => (
  <button className={className} onClick={onClick} title={title}>
    <EyeIcon
      fill={
        condition
          ? 'var(--sn-stylekit-info-color)'
          : 'var(--sn-stylekit-foreground-color)'
      }
      role={'button'}
    />
    <span className="button-caption">
      {caption}:<b>&nbsp;{condition ? messageOn : messageOff}</b>
    </span>
  </button>
);

export const PencilButton: React.FC<ActionButtonTypes> = ({
  caption,
  className,
  fill,
  onClick,
  title,
}) => (
  <button className={className} onClick={onClick} title={title}>
    <PencilIcon fill={fill} role={'button'} />
    <span className="button-caption">{caption}</span>
  </button>
);

export const PrintButton: React.FC<ActionButtonTypes> = ({
  caption,
  className,
  fill,
  id,
  onClick,
  title,
}) => (
  <button className={className} id={id} onClick={onClick} title={title}>
    <PrintIcon fill={fill} role={'button'} />
    <span className="button-caption">{caption}</span>
  </button>
);

export const UndoButton: React.FC<ActionButtonTypes> = ({
  fill,
  id,
  onClick,
  title,
}) => (
  <button id={id} onClick={onClick} title={title}>
    <UndoIcon fill={fill} role={'button'} />
  </button>
);
