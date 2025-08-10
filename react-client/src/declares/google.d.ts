export {}
declare global {
  interface Window {
    google: {
      accounts: {
        __initialized: boolean;
        id: {
          initialize: (config: {
            client_id: string | undefined;
            callback: (response: any) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'small' | 'medium' | 'large';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'sign_in';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            logo_alignment?: 'left' | 'center';
            width?: number;
          }) => void;
          prompt: () => void;
          disableAutoSelect: () => void
        }
      }
    }
  }
}