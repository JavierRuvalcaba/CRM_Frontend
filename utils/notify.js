import Swal from 'sweetalert2'

export const Notify = () => {
    Swal.fire({
        title: `Delete client ${client.name} ${client.lastname}`,
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ACCEPT'
    }).then( async result => {
        if(result.value) {
            try {
                const msg = await deleteClient({ variables: { id: client.id }})

                Swal.fire(
                    'Deleted!',
                    msg,
                    'success'
                )
            }
            catch(err) {
                console.log(err)
            }
        }
    })
}