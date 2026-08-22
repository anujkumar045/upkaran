from rest_framework import serializers

from .models import Post, PostLike, Comment


class CommentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    profile_picture = serializers.ImageField(
        source="user.profile_picture",
        read_only=True
    )

    class Meta:
        model = Comment

        fields = [
            "id",
            "post",
            "user",
            "username",
            "profile_picture",
            "content",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "created_at",
            "updated_at",
        ]


class PostSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="author.username",
        read_only=True
    )

    profile_picture = serializers.ImageField(
        source="author.profile_picture",
        read_only=True
    )

    likes_count = serializers.IntegerField(
        read_only=True
    )

    comments_count = serializers.IntegerField(
        read_only=True
    )

    is_liked = serializers.SerializerMethodField()

    comments = CommentSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Post

        fields = [
            "id",
            "author",
            "username",
            "profile_picture",
            "content",
            "image",
            "likes_count",
            "comments_count",
            "is_liked",
            "comments",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "author",
            "username",
            "profile_picture",
            "likes_count",
            "comments_count",
            "is_liked",
            "comments",
            "created_at",
            "updated_at",
        ]

    def get_is_liked(self, obj):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        return PostLike.objects.filter(
            post=obj,
            user=request.user
        ).exists()


class PostLikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostLike

        fields = [
            "id",
            "post",
            "user",
            "created_at",
        ]

        read_only_fields = [
            "user",
            "created_at",
        ]