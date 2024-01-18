from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from .models import Video
from .permissions import IsOwnerOrReadOnly
from .serializers import VideoSerializer
from .pagination import CustomPagination
from .filters import VideoFilter
from rest_framework.pagination import PageNumberPagination
from .models import Comment
from .serializers import CommentSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
import resend

class VideoLikeToggleView(generics.UpdateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def update(self, request, *args, **kwargs):
        video = self.get_object()
        user = self.request.user

        if user in video.likes.all():
            video.likes.remove(user)
        else:
            video.likes.add(user)
        video.save()
        serializer = self.get_serializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SendEmail(APIView):
    def get(self, request, pk):
        video = get_object_or_404(Video, pk=pk)
        resend.api_key = "re_A5X3rGAM_K2D7Vh3FBX8jekiqFhtUmaqD"
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Felicitaciones por finalizar el curso</title>
            <style>
                body {{
                    background-color: #356fe4;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }}

                .container {{
                    width: 80%;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }}

                h1 {{
                    color: #356fe4;
                    text-align: center;
                }}

                p {{
                    text-align: center;
                    font-size: 18px;
                    line-height: 1.6;
                    color: #000000;
                }}

                strong {{
                    font-weight: bold;
                }}

                .certificate {{
                    text-align: center;
                    margin-top: 20px;
                }}

                .certificate img {{
                    width: 80%;
                    max-width: 400px;
                    height: auto;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>¡Felicitaciones por finalizar el curso!</h1>
                <p>Hola {self.request.user.first_name}</p>
                <p>Hemos recibido la confirmación de que has completado con éxito el curso <strong>{video.title}</strong> Felicitaciones por tu dedicación y esfuerzo.</p>
                <div class="certificate">
                    <p>A continuación, adjuntamos tu certificado de finalización:</p>
                    <img src="https://pbs.twimg.com/profile_images/1516135443603017729/MufP-LJK_400x400.jpg" alt="Certificado de Finalización">
                </div>
                <p>¡Gracias por elegir nuestro curso! Esperamos que hayas encontrado la experiencia educativa valiosa.</p>
                <p>¡Continúa con el buen trabajo y sigue aprendiendo!</p>
                <p>Saludos,</p>
                <p>CIBRUC</p>
            </div>
        </body>
        </html>
        """

        # Configuración del correo y envío
        r = resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": self.request.user.email,
            "subject": "Felicitaciones por finalizar el curso",
            "html": html_content
        })

        return Response(status=status.HTTP_200_OK)

class VideoDislikeToggleView(generics.UpdateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def update(self, request, *args, **kwargs):
        video = self.get_object()
        user = self.request.user

        if user in video.dislikes.all():
            video.dislikes.remove(user)
        else:
            video.dislikes.add(user)
        video.save()
        serializer = self.get_serializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListCreateCommentAPIView(ListCreateAPIView):
    queryset = Comment.objects.all().order_by('-hour')
    serializer_class = CommentSerializer
    pagination_class = CustomPagination

class ListCreateVideoAPIView(ListCreateAPIView):
    serializer_class = VideoSerializer
    pagination_class = CustomPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = VideoFilter

    def perform_create(self, serializer):
        # Assign the user who created the video
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        # Filtrar los videos donde listed es True
        return Video.objects.filter(listed=True)

class ListAllVideosAPIView(ListCreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    pagination_class = CustomPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = VideoFilter

    def perform_create(self, serializer):
        # Assign the user who created the video
        serializer.save(creator=self.request.user)

class RetrieveUpdateDestroyCommentAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-hour')

class RetrieveUpdateDestroyVideoAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class ListCommentsAPIView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        video_id = self.kwargs['video_id']
        return Comment.objects.filter(video_id=video_id)

class ListVideosAPIView(ListAPIView):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    pagination_class = CustomPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = VideoFilter

class RetrieveVideoAPIView(RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerOrReadOnly]    

class RetrieveAllVideosAPIView(RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsOwnerOrReadOnly]

class NumVideosAPIView(ListAPIView):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = VideoFilter

class IncrementVideoViewsAPIView(APIView):
    def get(self, request, pk):
        video = get_object_or_404(Video, pk=pk)
        video.views_count += 1
        video.save()

        serializer = VideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)