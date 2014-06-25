#encoding:utf-8
from django import forms

class LoginForm(forms.Form):
	email = forms.CharField(label ="" , widget=forms.TextInput(  attrs = { 'placeholder' :"email" } ))
	password = forms.CharField( label = "" , widget = forms.PasswordInput( attrs = { 'placeholder' : "password" } ))
	
