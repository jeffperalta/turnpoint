import { Tooltip, IconButton } from "@mui/material";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import './FormTooltip.css';

export default function FormTooltip({
  message="",
  ...props
}) {
  return (
    <Tooltip title={message} className="form-tooltip">
      <IconButton size="small" aria-label="info" sx={{ padding: 0 }}>
        {/* <InfoOutlinedIcon fontSize="small" htmlColor="#1976d2"/> */}
      </IconButton>
    </Tooltip>
  )
}