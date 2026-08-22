from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Post, PostLike, Comment
from community.serializers import (
    PostSerializer,
    CommentSerializer,
)


class PostViewSet(viewsets.ModelViewSet):

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Post.objects.select_related(
            "author"
        ).prefetch_related(
            "likes",
            "comments__user"
        )

    def perform_create(self, serializer):

        serializer.save(
            author=self.request.user
        )

    def perform_update(self, serializer):

        post = self.get_object()

        if post.author != self.request.user:
            raise PermissionDenied(
                "You can only edit your own posts."
            )

        serializer.save()

    def perform_destroy(self, instance):

        if (
            instance.author != self.request.user
            and not self.request.user.is_staff
        ):
            raise PermissionDenied(
                "You can only delete your own posts."
            )

        instance.delete()

    # ---------------------------------------------
    # LIKE / UNLIKE
    # ---------------------------------------------

    @action(
        detail=True,
        methods=["post"]
    )
    def like(self, request, pk=None):

        post = self.get_object()

        like, created = PostLike.objects.get_or_create(
            post=post,
            user=request.user
        )

        if not created:
            return Response(
                {
                    "message": "Post already liked."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Post liked.",
                "likes_count": post.likes.count()
            },
            status=status.HTTP_201_CREATED
        )

    @action(
        detail=True,
        methods=["post"]
    )
    def unlike(self, request, pk=None):

        post = self.get_object()

        deleted, _ = PostLike.objects.filter(
            post=post,
            user=request.user
        ).delete()

        if deleted == 0:
            return Response(
                {
                    "message": "Post was not liked."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Post unliked.",
                "likes_count": post.likes.count()
            }
        )

    # ---------------------------------------------
    # COMMENTS
    # ---------------------------------------------

    @action(
        detail=True,
        methods=["get", "post"]
    )
    def comments(self, request, pk=None):

        post = self.get_object()

        if request.method == "GET":

            comments = post.comments.select_related(
                "user"
            )

            serializer = CommentSerializer(
                comments,
                many=True,
                context={"request": request}
            )

            return Response(serializer.data)

        serializer = CommentSerializer(
            data={
                "post": post.id,
                "content": request.data.get("content")
            },
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        serializer.save(
            user=request.user
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )