import React from 'react';

const defaultFill = 'var(--sn-stylekit-foreground-color)';

interface Icons {
  fill?: string;
  role: string;
}

export const ChevronIconDown: React.FC<Icons> = ({ fill, role }) => (
  <span className="chevron-icon down">
    <svg
      aria-label="chevron icon down"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.17622 7.15015L10.0012 10.9751L13.8262 7.15015L15.0012 8.33348L10.0012 13.3335L5.00122 8.33348L6.17622 7.15015Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const ChevronIconRight: React.FC<Icons> = ({ fill, role }) => (
  <span className="chevron-icon right">
    <svg
      aria-label="chevron icon down"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.90918 14.0667L10.7342 10.2417L6.90918 6.4167L8.09251 5.2417L13.0925 10.2417L8.09251 15.2417L6.90918 14.0667Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const CloseIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="close-icon">
    <svg
      aria-label="close icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2459 5.92917C15.5704 5.6047 15.5704 5.07864 15.2459 4.75417C14.9214 4.4297 14.3954 4.4297 14.0709 4.75417L10.0001 8.82501L5.92925 4.75417C5.60478 4.4297 5.07872 4.4297 4.75425 4.75417C4.42978 5.07864 4.42978 5.6047 4.75425 5.92917L8.82508 10L4.75425 14.0708C4.42978 14.3953 4.42978 14.9214 4.75425 15.2458C5.07872 15.5703 5.60478 15.5703 5.92925 15.2458L10.0001 11.175L14.0709 15.2458C14.3954 15.5703 14.9214 15.5703 15.2459 15.2458C15.5704 14.9214 15.5704 14.3953 15.2459 14.0708L11.1751 10L15.2459 5.92917Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const CopyIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="copy-icon">
    <svg
      aria-label="copy icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.66724 3.66626C1.66724 2.56169 2.56267 1.66626 3.66724 1.66626H11.3339C12.4385 1.66626 13.3339 2.56169 13.3339 3.66626V13.3329H3.66724C2.56267 13.3329 1.66724 12.4375 1.66724 11.3329V3.66626ZM16.3339 6.66626C17.4385 6.66626 18.3339 7.56169 18.3339 8.66626V16.3329C18.3339 17.4375 17.4385 18.3329 16.3339 18.3329H8.66724C7.56267 18.3329 6.66724 17.4375 6.66724 16.3329V14.9996H15.0006V6.66626H16.3339ZM3.3339 3.33293V11.6663H11.6672V3.33293H3.3339Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const EyeIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="eye-icon">
    <svg
      aria-label="eye icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99992 7.5C9.33688 7.5 8.70099 7.76339 8.23215 8.23223C7.76331 8.70107 7.49992 9.33696 7.49992 10C7.49992 10.663 7.76331 11.2989 8.23215 11.7678C8.70099 12.2366 9.33688 12.5 9.99992 12.5C10.663 12.5 11.2988 12.2366 11.7677 11.7678C12.2365 11.2989 12.4999 10.663 12.4999 10C12.4999 9.33696 12.2365 8.70107 11.7677 8.23223C11.2988 7.76339 10.663 7.5 9.99992 7.5ZM9.99992 14.1667C8.89485 14.1667 7.83504 13.7277 7.05364 12.9463C6.27224 12.1649 5.83325 11.1051 5.83325 10C5.83325 8.89493 6.27224 7.83512 7.05364 7.05372C7.83504 6.27232 8.89485 5.83333 9.99992 5.83333C11.105 5.83333 12.1648 6.27232 12.9462 7.05372C13.7276 7.83512 14.1666 8.89493 14.1666 10C14.1666 11.1051 13.7276 12.1649 12.9462 12.9463C12.1648 13.7277 11.105 14.1667 9.99992 14.1667ZM9.99992 3.75C5.83325 3.75 2.27492 6.34167 0.833252 10C2.27492 13.6583 5.83325 16.25 9.99992 16.25C14.1666 16.25 17.7249 13.6583 19.1666 10C17.7249 6.34167 14.1666 3.75 9.99992 3.75Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const PencilIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="pencil-icon">
    <svg
      aria-label="pencil icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.2583 5.86655C17.5833 5.54155 17.5833 4.99989 17.2583 4.69155L15.3083 2.74155C15 2.41655 14.4583 2.41655 14.1333 2.74155L12.6 4.26655L15.725 7.39155L17.2583 5.86655ZM2.5 14.3749V17.4999H5.625L14.8417 8.27489L11.7167 5.14989L2.5 14.3749Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const PrintIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="print-icon">
    <svg
      aria-label="print icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.0001 2.5H5.00008V5.83333H15.0001V2.5ZM15.8334 10C15.6124 10 15.4004 9.9122 15.2442 9.75592C15.0879 9.59964 15.0001 9.38768 15.0001 9.16667C15.0001 8.94565 15.0879 8.73369 15.2442 8.57741C15.4004 8.42113 15.6124 8.33333 15.8334 8.33333C16.0544 8.33333 16.2664 8.42113 16.4227 8.57741C16.579 8.73369 16.6668 8.94565 16.6668 9.16667C16.6668 9.38768 16.579 9.59964 16.4227 9.75592C16.2664 9.9122 16.0544 10 15.8334 10ZM13.3334 15.8333H6.66675V11.6667H13.3334V15.8333ZM15.8334 6.66667H4.16675C3.50371 6.66667 2.86782 6.93006 2.39898 7.3989C1.93014 7.86774 1.66675 8.50363 1.66675 9.16667V14.1667H5.00008V17.5H15.0001V14.1667H18.3334V9.16667C18.3334 8.50363 18.07 7.86774 17.6012 7.3989C17.1323 6.93006 16.4965 6.66667 15.8334 6.66667Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const RefreshIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="refresh-icon">
    <svg
      aria-label="refresh icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99992 14.9999C8.67384 14.9999 7.40207 14.4731 6.46438 13.5355C5.5267 12.5978 4.99992 11.326 4.99992 9.99992C4.99992 9.16658 5.20825 8.35825 5.58325 7.66658L4.36659 6.44992C3.71659 7.47492 3.33325 8.69158 3.33325 9.99992C3.33325 11.768 4.03563 13.4637 5.28587 14.714C6.53612 15.9642 8.23181 16.6666 9.99992 16.6666V19.1666L13.3333 15.8332L9.99992 12.4999V14.9999ZM9.99992 3.33325V0.833252L6.66658 4.16658L9.99992 7.49992V4.99992C11.326 4.99992 12.5978 5.5267 13.5355 6.46438C14.4731 7.40207 14.9999 8.67383 14.9999 9.99992C14.9999 10.8333 14.7916 11.6416 14.4166 12.3333L15.6333 13.5499C16.2833 12.5249 16.6666 11.3083 16.6666 9.99992C16.6666 8.23181 15.9642 6.53612 14.714 5.28587C13.4637 4.03563 11.768 3.33325 9.99992 3.33325Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);

export const UndoIcon: React.FC<Icons> = ({ fill, role }) => (
  <span className="undo-icon">
    <svg
      aria-label="undo icon"
      role={role}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1812 7.66667C8.36883 7.66667 6.72741 8.33333 5.46214 9.4L3 7V13H9.15535L6.67953 10.5867C7.63019 9.81333 8.84074 9.33333 10.1812 9.33333C12.6023 9.33333 14.661 10.8733 15.3791 13L17 12.48C16.0493 9.68667 13.3615 7.66667 10.1812 7.66667Z"
        fill={fill ? fill : defaultFill}
      />
    </svg>
  </span>
);
