import btnStyles from './Button.module.scss';

function Button( {label, onClick, className=''} ) {
    return(
        <button
            className={`${className} ${btnStyles.btn}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export default Button;