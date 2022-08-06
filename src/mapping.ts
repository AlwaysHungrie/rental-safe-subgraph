import { updatedBio } from '../generated/Users/Users'
import { Bio, User } from '../generated/schema'

export function handleUpdatedBio(event: updatedBio): void {
  let userId = event.params.user.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
  }

  let bio = event.params.bio.split(',')
  let userBio = [] as Bio[]

  for (let i = 0; i < bio.length; i++) {
    const data = bio[i].trim()
    if (checkIfInt(data)) {
      const ageBio = new Bio(userId+i.toString())
      ageBio.key = 'age',
      ageBio.value = data
      userBio.push(ageBio)
      ageBio.save()
    }
    else if (data == 'M' || data == 'F') {
      const genderBio = new Bio(userId+i.toString())
      genderBio.key = 'gender',
      genderBio.value = data
      userBio.push(genderBio)
      genderBio.save()
    } else {
      const bio = new Bio(userId+i.toString())
      bio.key = 'unknown',
      bio.value = data
      userBio.push(bio)
      bio.save()
    }
  }

  user.bio = userBio.map<string>((bio: Bio) => bio.id) as string[]
  user.save()
}

function checkIfInt(s: string): boolean {
  const n = Number.parseInt(s)
  if (Number.isInteger(n)) {
    return true
  }

  return false
}