import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import './Empty.css'

export default function Empty({
  message = "Empty", 
  ...props
}) {
  return (
    <div className='empty--container'>
      <Inventory2OutlinedIcon sx={{ fontSize: 64 }} htmlColor='#c5c5c5'/>
      <h4>
        { message }
      </h4>
    </div>
  )
}