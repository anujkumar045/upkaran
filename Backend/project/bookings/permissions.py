from rest_framework.permissions import BasePermission


class IsBookingOwner(BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        return obj.user == request.user


class IsEquipmentOwner(BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        return obj.equipment.owner == request.user