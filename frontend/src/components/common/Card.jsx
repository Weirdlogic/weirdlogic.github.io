export const Card = ({ children, className = '' }) => (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {children}
    </div>
);