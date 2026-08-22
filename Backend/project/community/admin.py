from django.contrib import admin

from .models import Post, PostLike, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "author",
        "created_at",
    ]

    search_fields = [
        "author__username",
        "content",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "post",
        "user",
        "created_at",
    ]

    search_fields = [
        "user__username",
    ]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "post",
        "user",
        "created_at",
    ]

    search_fields = [
        "user__username",
        "content",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]