import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import { teal } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import EditIcon from '@mui/icons-material/Edit'
import Typography from '@mui/material/Typography'
import axiosClient from '../lib/axiosClient'
import { jsonFields } from '../lib/jsonHelper'
import AlertPopup from '../components/AlertPopup'
import IBike from '../interfaces/bike'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

function Bikes() {
  const [axiosError, setAxiosError] = useState<string | null>(null)
  const [bikeData, setBikes] = useState<IBike[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    axiosClient
      .get('/bikes')
      .then((response: any) => {
        setLoading(false)
        setBikes(response.data.bikes)
      })
      .catch((error) => {
        setLoading(false)
        const message = `Get device data failed: ${error.message}`
        console.error(message)
        setAxiosError(message)
      })
  }, [])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Box mb={1} display="flex" justifyContent="flex-start" alignItems="flex-start">
        <Link to="/bikes/new" className="button-link">
          <Button variant="contained" sx={{ background: teal['A700'] }}>
            Create
          </Button>
        </Link>
      </Box>
      {bikeData && bikeData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="bikes-table">
            <TableHead>
              <TableRow>
                {Object.keys(bikeData[0]).map((fieldName) => (
                  <StyledTableCell key={fieldName}>{fieldName}</StyledTableCell>
                ))}
                <StyledTableCell key={'actions'}></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bikeData.map((row: any) => (
                <StyledTableRow key={row._id}>
                  {Object.keys(bikeData[0]).map((fieldName) => (
                    <StyledTableCell key={`${row._id}-${fieldName}`}>
                      {fieldName === '_id' ? (
                        <Link to={`/bikes/${row._id}/edit`}>{row[fieldName]}</Link>
                      ) : jsonFields.includes(fieldName) ? (
                        JSON.stringify(row[fieldName])
                      ) : (
                        row[fieldName]
                      )}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell key={'actions'} sx={{ textAlign: 'center' }}>
                    <Link to={`/bikes/${row._id}/edit`} className="button-link">
                      <Button size="small" variant="outlined" startIcon={<EditIcon />}>
                        Edit
                      </Button>
                    </Link>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          noWrap
          component="div"
          mt={50}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          No bikes data yet!
        </Typography>
      )}
      {axiosError && <AlertPopup message={axiosError} />}
    </>
  )
}

export default Bikes