import './Loading.css'; 

interface LoadingProps {
  text?: string;
}

export default function Loading({ 
  text = 'Loading...', 
  ...props 
}: LoadingProps){
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}
