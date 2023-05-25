import './button.styles.scss'; 

/* 
3 types of button:
1. default
2. inverted
3. google signIn btn
*/
const BUTTON_TYPES_CLASSES = {
    google: 'google-sign-in',
    inverted: 'inverted',

}

const Button = ({ children, buttonType, ...otherProps }) => {
  return (
        <button 
            className={`button-container ${BUTTON_TYPES_CLASSES[buttonType]}`}
            {...otherProps}
        >
        {children}
    </button>
  )
}

export default Button;