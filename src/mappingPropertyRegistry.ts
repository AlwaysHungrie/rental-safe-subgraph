import { propertyRegistered } from '../generated/PropertyRegistry/PropertyRegistry'
import { Bio, Property, User } from '../generated/schema'

export function handlePropertyRegistered(event: propertyRegistered): void {
  let propertyId = event.params.propertyAddress.toHex()
  let property = new Property(propertyId)

  property.owner = event.params.user
  property.x = event.params.x.toI32()
  property.y = event.params.y.toI32()
  property.InterestedTenant = []
  property.save()
}